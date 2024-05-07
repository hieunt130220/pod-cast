//
//  NSObject+ext.swift
//  podcast
//
//  Created by Nguyen Trung Hieu on 7/5/24.
//

import Foundation
extension NSObject {
    var className: String {
        return NSStringFromClass(type(of: self))
    }
    class var className: String {
        return String(describing: self)
    }
}
