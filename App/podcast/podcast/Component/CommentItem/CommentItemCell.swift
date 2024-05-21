//
//  CommentItemCell.swift
//  podcast
//
//  Created by HieuNT on 21/05/2024.
//

import UIKit

class CommentItemCell: UITableViewCell {

    @IBOutlet weak var commentLbl: UILabel!
    @IBOutlet weak var dateLbl: UILabel!
    @IBOutlet weak var userNameLbl: UILabel!
    @IBOutlet weak var userImageView: UIImageView!
    var comment: Comment? {
        didSet {
            guard let comment = comment else { return }
            userImageView.kf.setImage(with: URL(string: comment.user.avatar))
            userNameLbl.text = comment.user.username
            commentLbl.text = comment.text
            dateLbl.text = comment.date.format(partern: "HH:mm dd/MM/yyyy")
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
