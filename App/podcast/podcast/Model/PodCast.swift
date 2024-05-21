//
//  PostCast.swift
//  podcast
//
//  Created by Nguyen Trung Hieu on 7/5/24.
//

import Foundation
import ObjectMapper
class PodCast: Mappable {
    
    var id: String = ""
    var user: User = User()
    var audio: String = ""
    var background: String = ""
    var likeCount: Int = 0
    var commentCount: Int = 0
    var isLike: Bool = false
    var caption: String = ""
    var uploadDate: Date = Date()
    
    required convenience init?(map: ObjectMapper.Map) {
        self.init()
    }
    
    func mapping(map: ObjectMapper.Map) {
        id <- map["_id"]
        user <- map["user"]
        audio <- map["audio"]
        likeCount <- map["like_count"]
        commentCount <- map["comment_count"]
        background <- map["background"]
        isLike <- map["is_like"]
        caption <- map["caption"]
        uploadDate <- (map["uploadDate"], CustomDateFormatTransform(formatString: "yyyy-MM-dd'T'HH:mm:ss.SSSZ"))
    }
}
