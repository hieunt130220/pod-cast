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
        }
    }
    var method: Moya.Method {
        switch self {
        case .login,
                .changePassword,
                .register:
            return .post
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
        }
    }

    var task: Moya.Task {
        if let parameters = self.parameters {
            return .requestParameters(parameters: parameters, encoding: self.parameterEncoding)
        } else {
            return .requestPlain
        }
    }
    var multipartBody: [Moya.MultipartFormData]? {
        return nil
    }
    var parameterEncoding: Moya.ParameterEncoding {
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