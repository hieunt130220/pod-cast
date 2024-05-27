//
//  File.swift
//  
//
//  Created by HieuNT on 27/05/2024.
//

import HTMLKit
import HTMLKitComponents

struct HomeView: View {
    
    var body: Content {
        AreaPageContainer {
            VStack {
                Link(destination: "/user") {
                    H1 {
                        "Users"
                    }
                }.backgroundColor(.gray)
                Divider()
                Link(destination: "/podcast") {
                    H1 {
                        "Pod casts"
                    }
                }.backgroundColor(.gray)
                Divider()
            }
            .backgroundColor(.cyan)
            .frame(width: .three)
        }
    }
}
