//
//  AppRepository.swift
//  podcast
//
//  Created by HieuNT on 02/05/2024.
//

import Foundation

class AppRepository {
    static let auth = AuthRepository()
    static let user = UserRepository()
    static let podCast = PodCastRepository()
}
