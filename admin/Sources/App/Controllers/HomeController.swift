//
//  File.swift
//  
//
//  Created by HieuNT on 27/05/2024.
//

import Vapor
import HTMLKitVapor

class HomeController  {
    // [/login]
    func index(_ request: Request) async throws -> View {
        return try await request.htmlkit.render(HomeView())
    }
}

extension HomeController: RouteCollection {
    
    func boot(routes: RoutesBuilder) throws {
        
        routes.group("home") { routes in
            routes.get("", use: self.index)
        }
    }
}
