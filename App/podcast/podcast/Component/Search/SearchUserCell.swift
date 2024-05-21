//
//  SearchUserCell.swift
//  podcast
//
//  Created by Nguyen Trung Hieu on 22/5/24.
//

import UIKit

class SearchUserCell: UITableViewCell {

    @IBOutlet weak var userNameLabel: UILabel!
    @IBOutlet weak var userImageView: UIImageView!
    
    var user: User? {
        didSet {
            guard let user = user else { return }
            userNameLabel.text = user.username
            userImageView.kf.setImage(with: URL(string: user.avatar))
        }
    }
    
    override func awakeFromNib() {
        super.awakeFromNib()
        // Initialization code
    }

    override func setSelected(_ selected: Bool, animated: Bool) {
        super.setSelected(selected, animated: animated)

        // Configure the view for the selected state
    }
    
}
