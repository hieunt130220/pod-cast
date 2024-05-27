//
//  File.swift
//  
//
//  Created by HieuNT on 23/05/2024.
//

import Vapor
import HTMLKitVapor

class LoginController  {

    @Sendable
    func getLogin(_ request: Request) async throws -> View {
        
        let viewModel = LoginViewModel()
        
        return try await request.htmlkit.render(LoginView(viewModel: viewModel))
    }
    
    @Sendable
    func postLogin(_ request: Request) async throws -> Response {
        
        try LoginModel.Input.validate(content: request)
        
        let model = try request.content.decode(LoginModel.Input.self)
        
        let response = try await request.client.post("http://localhost:8080/api/auth/login") { req in
            try req.content.encode(["email": model.email, "password": model.password])
        }
        
        if response.status == .ok {
            let auth = try response.content.decode(LoginResponse.self)
            request.application.storage.set(TokenStorage.self, to: auth.data.token)
            return request.redirect(to: "/home")
        }
        
        return request.redirect(to: "/login")
    }
}

extension LoginController: RouteCollection {
    
    func boot(routes: RoutesBuilder) throws {
        
        routes.group("login") { routes in
            routes.get("", use: self.getLogin)
            routes.post("", use: self.postLogin)
        }
    }
    
    struct LoginResponse: Codable {
        var data: Token
        struct Token: Codable {
            var token: String
        }
    }
}
