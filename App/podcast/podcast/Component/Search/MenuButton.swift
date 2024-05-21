//
//  MenuButton.swift
//  podcast
//
//  Created by Nguyen Trung Hieu on 21/5/24.
//

import UIKit

class MenuButton: UIButton {
    
    override var isSelected: Bool {
        didSet {
            borderWidth = 1
            borderColor = isSelected ? .clear : .blue
            setTitleColor(isSelected ? .white : .blue, for: .normal)
            backgroundColor = isSelected ? .blue : .clear
        }
    }
    
    override func layoutSubviews() {
        super.layoutSubviews()
        cornerRadii = bounds.height / 2
    }
}
