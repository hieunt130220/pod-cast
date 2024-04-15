//
//  SirocroAPI.swift
//  sirocro
//
//  Created by 柳田昌弘 on 2021/03/15.
//

import UIKit
import CoreLocation
import Moya
import Alamofire
import URLNavigator
import SwiftyJSON

enum StatusCode: Int {
    case badRequest = 400
    case unauthorized = 401
    case notFound = 404
    case forbidden = 403
    case serviceUnavailable = 500
}

enum SirocroAPI {
    
}

extension SirocroAPI: TargetType {
    var headers: [String: String]? {
        var headers: [String: String] = [:]
        return headers
    }
    var apiVersion: String {
        return "api/v1"
    }
    var baseURL: URL {
        let baseURL = ""
        return URL(string: baseURL)!
    }
    var path: String {
        return ""
    }
    var method: Moya.Method {
        return .get
    }
    var parameters: [String: Any]? {
        return [:]
    }
    var sampleData: Data {
        return Data()
    }
    var task: Moya.Task {
        return .requestPlain
    }
    var multipartBody: [Moya.MultipartFormData]? {
        return nil
    }
    var parameterEncoding: Moya.ParameterEncoding {
        return URLEncoding.default
    }
}

struct SirocroNetwork {
    static let queue = DispatchQueue(label: "com.actvn.hieunt.podcast.request", attributes: .concurrent)
    static let plugins: [PluginType] = [
        NetworkLoggerPlugin(configuration: NetworkLoggerPlugin.Configuration())
    ]
    static var provider = MoyaProvider<SirocroAPI>(
        plugins: plugins
    )
    
    static func request(
        target: SirocroAPI,
        success successCallback: @escaping (_ json: JSON?, _ allHeaderFields: [AnyHashable : Any]?) -> Void,
        progress progressCallback: ((_ value: Double) -> Void)? = nil,
        error errorCallback: @escaping (_ statusCode: Int) -> Void,
        failure failureCallback: @escaping (Moya.MoyaError) -> Void) -> Cancellable {
            return provider.request(target, callbackQueue: self.queue, progress: { response in
                progressCallback?(response.progress)
            }) { result in
                switch result {
                case let .success(response):
                    let headerFields = response.response?.allHeaderFields
                    do {
                        let res = try response.filterSuccessfulStatusAndRedirectCodes()
                        if (res.statusCode >= 300) {
                            successCallback(nil, headerFields)
                            return
                        }
                        let json = try JSON(response.mapJSON())
                        successCallback(json, headerFields)
                    } catch let error {
                        if response.statusCode == 200 {
                            successCallback(nil, headerFields)
                        }
                        switch error as! Moya.MoyaError {
                        case .statusCode(let response):
                            if let statusCode = StatusCode(rawValue: response.statusCode) {
                                switch statusCode {
                                case .unauthorized, .forbidden:
                                    break
                                case .serviceUnavailable:
                                    break
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
