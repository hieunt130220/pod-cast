//
//  FollowButton.swift
//  podcast
//
//  Created by Nguyen Trung Hieu on 21/5/24.
//

import UIKit

class FollowButton: UIButton {
    
    var isFollow: Bool = false {
        didSet {
            borderWidth = 1
            borderColor = isFollow ? .clear : .blue
            setTitleColor(isFollow ? .white : .blue, for: .normal)
            backgroundColor = isFollow ? .blue : .clear
        }
    }
    
    override func layoutSubviews() {
        super.layoutSubviews()
        cornerRadii = bounds.height / 2
    }
}
