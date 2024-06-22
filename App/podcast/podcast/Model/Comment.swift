//
//  Comment.swift
//  podcast
//
//  Created by HieuNT on 21/05/2024.
//

import Foundation
import ObjectMapper
class Comment: Mappable {
    var id: String = ""
    var date: Date = Date()
    var text: String = ""
    var user: User = User()
    required convenience init?(map: ObjectMapper.Map) {
        self.init()
    }
    
    func mapping(map: ObjectMapper.Map) {
        id <- map["_id"]
        user <- map["user"]
        text <- map["text"]
        date <- (map["date"], CustomDateFormatTransform(formatString: "yyyy-MM-dd'T'HH:mm:ss.SSSZ"))
    }
}
