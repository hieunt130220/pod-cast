//
//  SignupRequest.swift
//  podcast
//
//  Created by HieuNT on 16/04/2024.
//

import Foundation

struct SignupRequest: Codable {
    let username: String
    let email: String
    let password: String
}

struct SigninRequest: Codable {
    let email: String
    let password: String
}

struct ChangePasswordRequest: Codable {
    let oldPassword: String
    let newPassword: String
}
