//
//  User.swift
//  podcast
//
//  Created by HieuNT on 16/04/2024.
//

import Foundation
import ObjectMapper
class User: Mappable {
    
    var id: String = ""
    var username: String = ""
    var avatar: String = ""
    var email: String = ""
    var bio: String = ""
    var followers: Int = 0
    var followings: Int = 0
    var isFollowing: Bool = false
    var isFollowed: Bool = false
    
    required convenience init?(map: ObjectMapper.Map) {
        self.init()
    }
    
    func mapping(map: ObjectMapper.Map) {
        id <- map["_id"]
        username <- map["username"]
        avatar <- map["avatar"]
        email <- map["email"]
        bio <- map["bio"]
        followers <- map["followers"]
        followings <- map["followings"]
        isFollowing <- map["is_following"]
        isFollowed <- map["is_followed"]
    }
}

extension User {
    var isMe: Bool {
        return id == LocalData.shared.userId
    }
}
