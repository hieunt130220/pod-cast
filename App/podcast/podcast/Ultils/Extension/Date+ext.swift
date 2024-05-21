//
//  Date+ext.swift
//  podcast
//
//  Created by HieuNT on 21/05/2024.
//

import Foundation

extension Date {
    func format(partern: String) -> String {
        let formater = DateFormatter()
        formater.dateFormat = partern
        return formater.string(from: self)
    }
}
