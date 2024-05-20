//
//  PodCastRepository.swift
//  podcast
//
//  Created by HieuNT on 15/04/2024.
//

import Foundation
import ObjectMapper
class PodCastRepository {
    func getPostCast(
        by userId: String,
        page: Int,
        per: Int,
        completion: ((_ postCasts: [PostCast], _ hasNextPage: Bool) -> Void)? = { _, _ in },
        failure: ((_ error: NSError?, _ statusCode: Int?) -> Void)? = { _, _ in }
        ) {
        let _ = API.request(
            target: .getPostCast(userId: userId, page: page, limit: per),
            success: { json, allHeaderFields in
                var hasNextPage = false
                if let hasNext = json?["has_next"].boolValue {
                    hasNextPage = hasNext
                }
                guard let postCast: [PostCast] = Mapper<PostCast>().mapArray(JSONObject: json?["data"].arrayObject) else {
                    failure?(nil, nil)
                    return
                }
                DispatchQueue.main.async {
                    completion?(postCast, hasNextPage)
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
    
    func like(
        postId: String,
        completion: ((_ success: Bool) -> Void)? = { _ in },
        failure: ((_ error: NSError?, _ statusCode: Int?) -> Void)? = { _, _ in }
        ) {
        let _ = API.request(
            target: .likePostCast(postId: postId),
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
    
    func unLike(
        postId: String,
        completion: ((_ success: Bool) -> Void)? = { _ in },
        failure: ((_ error: NSError?, _ statusCode: Int?) -> Void)? = { _, _ in }
        ) {
        let _ = API.request(
            target: .unLikePostCast(postId: postId),
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
    
    func getPostCastFollowing(
        page: Int,
        per: Int,
        completion: ((_ postCasts: [PostCast], _ hasNextPage: Bool) -> Void)? = { _, _ in },
        failure: ((_ error: NSError?, _ statusCode: Int?) -> Void)? = { _, _ in }
        ) {
        let _ = API.request(
            target: .getPostCastFollow(page: page, limit: per),
            success: { json, allHeaderFields in
                var hasNextPage = false
                if let hasNext = json?["has_next"].boolValue {
                    hasNextPage = hasNext
                }
                guard let postCast: [PostCast] = Mapper<PostCast>().mapArray(JSONObject: json?["data"].arrayObject) else {
                    failure?(nil, nil)
                    return
                }
                DispatchQueue.main.async {
                    completion?(postCast, hasNextPage)
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
}
