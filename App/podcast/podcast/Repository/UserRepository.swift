//
//  UserRepository.swift
//  podcast
//
//  Created by HieuNT on 15/04/2024.
//

import Foundation
import ObjectMapper

class UserRepository {
    func getMe(completion: @escaping(_ user: User) -> Void,
                  failure: @escaping(_ error: Error?, _ statusCode: Int?) -> Void) {
        _ = API.request(target: .getMe, success: { json, allHeaderFields in
            guard let user: User = Mapper<User>().map(JSONObject: json?["data"].object) else {
                failure(nil, nil)
                return
            }
            DispatchQueue.main.async {
                completion(user)
            }
        }, error: { statusCode in
            failure(nil, statusCode)
        }, failure: { error in
            failure(error, nil)
        })
    }
}
