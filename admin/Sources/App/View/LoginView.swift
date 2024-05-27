//
//  File.swift
//  
//
//  Created by HieuNT on 23/05/2024.
//

import HTMLKit
import HTMLKitComponents
struct LoginView: View {
    var viewModel: LoginViewModel
    
    var body: Content {
        AreaPageContainer {
            Main {
                HStack(spacing: .around) {
                    VStack(spacing: .around) {
                        Card {
                            Form(method: .post) {
                                VStack {
                                    FieldLabel(for: "email") {
                                        "Email"
                                    }
                                    TextField(name: "email")
                                        .borderShape(.smallrounded)
                                }
                                VStack {
                                    FieldLabel(for: "password") {
                                        "Password"
                                    }
                                    SecureField(name: "password")
                                        .borderShape(.smallrounded)
                                }
                                .margin(insets: .bottom, length: .small)
                                HStack {
                                    Button(role: .submit) {
                                        "Sign in"
                                    }
                                    .controlSize(.full)
                                }
                                .margin(insets: .bottom, length: .small)
                            }
                            .tag("login-form")
                            .onSubmit { form in
                                form.validate("login-form", LoginModel.Input.validators)
                            }
                        }
                        .borderShape(.smallrounded)
                        .frame(width: .twelve)
                    }
                    .frame(width: .three)
                }
            }
        }
    }
}
