//
//  LocalData.swift
//  podcast
//
//  Created by HieuNT on 16/04/2024.
//

import Foundation

class LocalData {
    
    static let shared = LocalData()
    
    private init() { }
    
    private let userdefault = UserDefaults.standard
    
    var token: String {
        get {
            return userdefault.string(forKey: "token") ?? ""
        }
        set {
            userdefault.setValue(newValue, forKey: "token")
        }
    }
    
    var userId: String {
        get {
            return userdefault.string(forKey: "userId") ?? ""
        }
        set {
            userdefault.setValue(newValue, forKey: "userId")
        }
    }
}

extension LocalData {
    func withdrawn() {
        token = ""
        userId = ""
    }
}
