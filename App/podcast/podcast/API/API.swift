import UIKit
import CoreLocation
import Moya
import Alamofire
import URLNavigator
import SwiftyJSON

enum StatusCode: Int {
    case success = 200
    case badRequest = 400
    case unauthorized = 401
    case notFound = 404
    case forbidden = 403
    case serviceUnavailable = 500
}

enum APIRouter {
    case register(params: SignupRequest)
    case login(params: SigninRequest)
    case changePassword(params: ChangePasswordRequest)
    case getMe
    
    case newPodCast(caption: String, imgData: Data, audioData: Data)
    case getPodCastFollow(page: Int, limit: Int)
    case getPodCast(userId: String, page: Int, limit: Int)
    case likePostCast(postId: String)
    case unLikePostCast(postId: String)
    case getComment(postId: String, page: Int, limit: Int)
    case postComment(postId: String, comment: String)
}

extension APIRouter: TargetType {
    var headers: [String: String]? {
        var headers: [String: String] = [:]
        let token = LocalData.shared.token
        if !token.isEmpty {
            headers["Authorization"] = "Bearer \(token)"
        }
        return headers
    }
    
    var baseURL: URL {
        let baseURL = "http://localhost:8080/api"
        return URL(string: baseURL)!
    }
    var path: String {
        switch self {
        case .register:
            return "/auth/register"
        case .login:
            return "/auth/login"
        case .changePassword:
            return "/auth/change_password"
        case .getMe:
            return "/users/me"
            
        case .newPodCast:
            return "/podcast"
        case .getPodCastFollow:
            return "/podcast/new_feed"
        case .getPodCast(let userId, page: _, limit: _):
            return "/podcast/user/\(userId)"
        case .likePostCast(postId: let postId):
            return "/podcast/\(postId)/like"
        case .unLikePostCast(postId: let postId):
            return "/podcast/\(postId)/unlike"
        case .getComment(let postId, page: _, limit: _):
            return "/podcast/\(postId)/comment"
        case .postComment(let postId, comment: _):
            return "/podcast/\(postId)/comment"
        }
    }
    var method: Moya.Method {
        switch self {
        case .login,
                .changePassword,
                .register,
                .likePostCast,
                .unLikePostCast,
                .newPodCast,
                .postComment:
            return .post
        default: return .get
        }
    }
    var parameters: [String: Any]? {
        switch self {
        case .register(let params):
            return params.dictionary
        case .login(let params):
            return params.dictionary
        case .changePassword(let params):
            return params.dictionary
        case .getMe:
            return nil
        case .newPodCast:
            return nil
        case .getPodCastFollow(let page, let limit):
            return ["page": page, "perPage": limit]
        case .getPodCast(userId: _, page: let page, limit: let limit):
            return ["page": page, "perPage": limit]
        case .likePostCast:
            return nil
        case .unLikePostCast:
            return nil
        case .getComment(postId: _, let page, let limit):
            return ["page": page, "perPage": limit]
        case .postComment(postId: _, let comment):
            return ["comment": comment]
        }
    }

    var task: Moya.Task {
        if let parameters = self.parameters {
            return .requestParameters(parameters: parameters, encoding: self.parameterEncoding)
        } else if let multipartBody = multipartBody {
            return .uploadMultipart(multipartBody)
        } else {
            return .requestPlain
        }
    }
    var multipartBody: [Moya.MultipartFormData]? {
        switch self {
        case .newPodCast(let caption, let imgData, let audioData):
            var data: [Moya.MultipartFormData] = []
            data.append(Moya.MultipartFormData(provider: .data(imgData), name: "background", fileName: "upload.jpeg", mimeType: "image/jpeg"))
            data.append(Moya.MultipartFormData(provider: .data(audioData), name: "file", fileName: "audio.mp3", mimeType: "audio/mp3"))
            let captionData = String(caption).data(using: String.Encoding.utf8) ?? Data()
            data.append(MultipartFormData(provider: .data(captionData), name: "caption"))
            return data
        default:
            return nil
        }
    }
    var parameterEncoding: Moya.ParameterEncoding {
        if method == .get {
            return URLEncoding.default
        }
        return JSONEncoding.default
    }
}

struct API {
    static let queue = DispatchQueue(label: "com.actvn.hieunt.podcast.request", attributes: .concurrent)
    static let plugins: [PluginType] = [
        NetworkLoggerPlugin(configuration: NetworkLoggerPlugin.Configuration())
    ]
    static var provider = MoyaProvider<APIRouter>(
        plugins: plugins
    )
    
    static func request(target: APIRouter,
                        success successCallback: @escaping (_ json: JSON?, _ allHeaderFields: [AnyHashable : Any]?) -> Void,
                        progress progressCallback: ((_ value: Double) -> Void)? = nil,
                        error errorCallback: @escaping (_ statusCode: Int) -> Void,
                        failure failureCallback: @escaping (Moya.MoyaError) -> Void) -> Cancellable {
        return provider.request(target, callbackQueue: self.queue,
                                progress: { response in
            progressCallback?(response.progress)
        }) { result in
            switch result {
            case let .success(response):
                let headerFields = response.response?.allHeaderFields
                do {
                    let res = try response.filterSuccessfulStatusAndRedirectCodes()
                    if (res.statusCode >= 300) {
                        DispatchQueue.main.async {
                            successCallback(nil, headerFields)
                        }
                        return
                    }
                    let json = try JSON(response.mapJSON())
                    DispatchQueue.main.async {
                        successCallback(json, headerFields)
                    }
                } catch let error {
                    if response.statusCode == 200 {
                        successCallback(nil, headerFields)
                    }
                    switch error as! Moya.MoyaError {
                    case .statusCode(let response):
                        if let statusCode = StatusCode(rawValue: response.statusCode) {
                            switch statusCode {
                            case .unauthorized:
                                LocalData.shared.token = ""
                            default:
                                DispatchQueue.main.async {
                                    errorCallback(statusCode.rawValue)
                                }
                            }
                        } else {
                            DispatchQueue.main.async {
                                failureCallback(error as! MoyaError)
                            }
                        }
                    default:
                        DispatchQueue.main.async {
                            failureCallback(error as! Moya.MoyaError)
                        }
                    }
                }
            case let .failure(error):
                DispatchQueue.main.async {
                    failureCallback(error)
                }
            }
        }
    }
}
