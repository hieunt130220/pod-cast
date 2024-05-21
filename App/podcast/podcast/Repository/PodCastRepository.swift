//
//  PodCastRepository.swift
//  podcast
//
//  Created by HieuNT on 15/04/2024.
//

import Foundation
import ObjectMapper
class PodCastRepository {
    func getPodCast(
        by userId: String,
        page: Int,
        per: Int,
        completion: ((_ postCasts: [PodCast], _ hasNextPage: Bool) -> Void)? = { _, _ in },
        failure: ((_ error: NSError?, _ statusCode: Int?) -> Void)? = { _, _ in }
        ) {
        let _ = API.request(
            target: .getPodCast(userId: userId, page: page, limit: per),
            success: { json, allHeaderFields in
                var hasNextPage = false
                if let hasNext = json?["has_next"].boolValue {
                    hasNextPage = hasNext
                }
                guard let postCast: [PodCast] = Mapper<PodCast>().mapArray(JSONObject: json?["data"].arrayObject) else {
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
    
    func getPodCastFollowing(
        page: Int,
        per: Int,
        completion: ((_ postCasts: [PodCast], _ hasNextPage: Bool) -> Void)? = { _, _ in },
        failure: ((_ error: NSError?, _ statusCode: Int?) -> Void)? = { _, _ in }
        ) {
        let _ = API.request(
            target: .getPodCastFollow(page: page, limit: per),
            success: { json, allHeaderFields in
                var hasNextPage = false
                if let hasNext = json?["has_next"].boolValue {
                    hasNextPage = hasNext
                }
                guard let postCast: [PodCast] = Mapper<PodCast>().mapArray(JSONObject: json?["data"].arrayObject) else {
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
    
    func createNew(
        caption: String,
        background: Data,
        audio: Data,
        completion: ((_ postCast: PodCast) -> Void)? = { _ in },
        failure: ((_ error: NSError?, _ statusCode: Int?) -> Void)? = { _, _ in }
        ) {
        let _ = API.request(
            target: .newPodCast(caption: caption, imgData: background, audioData: audio),
            success: { json, allHeaderFields in
                guard let data = json?["data"], let postCast: PodCast = Mapper<PodCast>().map(JSONObject: data) else {
                    failure?(nil, nil)
                    return
                }
                DispatchQueue.main.async {
                    completion?(postCast)
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
    
    func getComments(
        postId: String,
        page: Int,
        per: Int,
        completion: ((_ postCasts: [Comment], _ hasNextPage: Bool) -> Void)? = { _, _ in },
        failure: ((_ error: NSError?, _ statusCode: Int?) -> Void)? = { _, _ in }
        ) {
        let _ = API.request(
            target: .getComment(postId: postId, page: page, limit: per),
            success: { json, allHeaderFields in
                var hasNextPage = false
                if let hasNext = json?["has_next"].boolValue {
                    hasNextPage = hasNext
                }
                guard let comments: [Comment] = Mapper<Comment>().mapArray(JSONObject: json?["data"].arrayObject) else {
                    failure?(nil, nil)
                    return
                }
                DispatchQueue.main.async {
                    completion?(comments, hasNextPage)
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
    
    func postComment(
        postId: String,
        comment: String,
        completion: ((_ comment: Comment) -> Void)? = { _ in },
        failure: ((_ error: NSError?, _ statusCode: Int?) -> Void)? = { _, _ in }
        ) {
        let _ = API.request(
            target: .postComment(postId: postId, comment: comment),
            success: { json, allHeaderFields in
                guard let data = json?["data"].object, let comment: Comment = Mapper<Comment>().map(JSONObject: data) else {
                    failure?(nil, nil)
                    return
                }
                DispatchQueue.main.async {
                    completion?(comment)
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
        caption: String,
        completion: @escaping(_ podCasts: [PodCast]) -> Void,
        failure: @escaping(_ error: Error?, _ statusCode: Int?) -> Void
    ) {
        _ = API.request(target: .searchPodCast(textSearch: caption), success: { json, allHeaderFields in
            guard let podCasts: [PodCast] = Mapper<PodCast>().mapArray(JSONObject: json?["data"].arrayObject) else {
                failure(nil, nil)
                return
            }
            DispatchQueue.main.async {
                completion(podCasts)
            }
        }, error: { statusCode in
            failure(nil, statusCode)
        }, failure: { error in
            failure(error, nil)
        })
    }
}
