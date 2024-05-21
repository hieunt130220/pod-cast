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
    
    func getOtherUser(
        uid: String,
        completion: @escaping(_ user: User) -> Void,
        failure: @escaping(_ error: Error?, _ statusCode: Int?) -> Void
    ) {
        _ = API.request(target: .getUser(uid: uid), success: { json, allHeaderFields in
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
    
    func follow(
        uid: String,
        completion: ((_ success: Bool) -> Void)? = { _ in },
        failure: ((_ error: NSError?, _ statusCode: Int?) -> Void)? = { _, _ in }
        ) {
        let _ = API.request(
            target: .follow(uid: uid),
            success: { json, allHeaderFields in
                DispatchQueue.main.async {
                    completion?(json?["status_code"].intValue == StatusCode.success.rawValue)
                }
            },
            error: { statusCode in
                failure?(nil, statusCode)
            },
            failure: { error in
                failure?((error as NSError), nil)
            }
        )
    }
    
    func unFollow(
        uid: String,
        completion: ((_ success: Bool) -> Void)? = { _ in },
        failure: ((_ error: NSError?, _ statusCode: Int?) -> Void)? = { _, _ in }
        ) {
        let _ = API.request(
            target: .unFollow(uid: uid),
            success: { json, allHeaderFields in
                DispatchQueue.main.async {
                    completion?(json?["status_code"].intValue == StatusCode.success.rawValue)
                }
            },
            error: { statusCode in
                failure?(nil, statusCode)
            },
            failure: { error in
                failure?((error as NSError), nil)
            }
        )
    }
    
    func search(
        userName: String,
        completion: @escaping(_ users: [User]) -> Void,
        failure: @escaping(_ error: Error?, _ statusCode: Int?) -> Void
    ) {
        _ = API.request(target: .searchUser(textSearch: userName), success: { json, allHeaderFields in
            guard let users: [User] = Mapper<User>().mapArray(JSONObject: json?["data"].arrayObject) else {
                failure(nil, nil)
                return
            }
            DispatchQueue.main.async {
                completion(users)
            }
        }, error: { statusCode in
            failure(nil, statusCode)
        }, failure: { error in
            failure(error, nil)
        })
    }
    
    func update(
        avatar: Data? = nil,
        userName: String? = nil,
        completion: @escaping(_ user: User) -> Void,
        failure: @escaping(_ error: Error?, _ statusCode: Int?) -> Void
    ) {
        _ = API.request(target: .updateProfile(avatar: avatar, userName: userName), success: { json, allHeaderFields in
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
