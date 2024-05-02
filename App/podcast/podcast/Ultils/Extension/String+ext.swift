//
//  String+ext.swift
//  podcast
//
//  Created by HieuNT on 02/05/2024.
//

import Foundation

extension String {
    
    func isSatifyRegex(pattern: String) -> Bool {
        do {
            let regex = try NSRegularExpression(pattern: pattern)
            return regex.firstMatch(in: self, range: NSRange(location: 0, length: self.utf16.count)) != nil
        } catch {
            fatalError("")
        }
    }
    
    enum ContentType {
        case email, password, username
        
        var regex: String {
            switch self {
            case .email:
                return "^[\\w-\\.+]+@([\\w-]+\\.)+[\\w-]+$"
            case .password:
                return "^[a-zA-Z0-9]{8,16}$"
            case .username:
                return "^[a-zA-Z0-9._]{3,16}$"
            }
        }
    }
    
    func isValid(_ type: ContentType) -> Bool {
        return isSatifyRegex(pattern: type.regex)
    }
}
