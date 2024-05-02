//
//  AuthRepository.swift
//  podcast
//
//  Created by HieuNT on 15/04/2024.
//

import Foundation

class AuthRepository {
    
    func register(params: SignupRequest, completion: @escaping(_ token: String) -> Void,
                  failure: @escaping(_ error: Error?, _ statusCode: Int?) -> Void) {
        _ = API.request(target: .register(params: params), success: { json, allHeaderFields in
            if let token = json?["data"]["token"] as? String {
                completion(token)
            }
        }, error: { statusCode in
            failure(nil, statusCode)
        }, failure: { error in
            failure(error, nil)
        })
    }
    
    func login(params: SigninRequest, completion: @escaping(_ token: String) -> Void,
                  failure: @escaping(_ error: Error?, _ statusCode: Int?) -> Void) {
        _ = API.request(target: .login(params: params), success: { json, allHeaderFields in
            if let token = json?["data"]["token"].string {
                completion(token)
            }
        }, error: { statusCode in
            failure(nil, statusCode)
        }, failure: { error in
            failure(error, nil)
        })
    }
    
    func changePassword(params: ChangePasswordRequest, completion: @escaping(_ success: Bool) -> Void,
                  failure: @escaping(_ error: Error?, _ statusCode: Int?) -> Void) {
        _ = API.request(target: .changePassword(params: params), success: { json, allHeaderFields in
            if (json?["status_code"] as? Int) == StatusCode.success.rawValue {
                completion(true)
            }
        }, error: { statusCode in
            failure(nil, statusCode)
        }, failure: { error in
            failure(error, nil)
        })
    }
}
