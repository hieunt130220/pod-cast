//
//  PodCastItemCell.swift
//  podcast
//
//  Created by Nguyen Trung Hieu on 7/5/24.
//

import UIKit
protocol PodCastItemCellDelegate: AnyObject {
    func podCastItemCell(didTapLikeButtonInside cell: PodCastItemCell)
    func podCastItemCell(didTapCommentButtonInside cell: PodCastItemCell)
    func podCastItemCell(didTapDeleteButtonInside cell: PodCastItemCell)
}

class PodCastItemCell: UITableViewCell {

    @IBOutlet weak var deleteBtn: UIButton! {
        didSet {
            deleteBtn.isHidden = true
        }
    }
    @IBOutlet weak var avatarImageView: UIImageView!
    @IBOutlet weak var userNameLbl: UILabel!
    @IBOutlet weak var captionLbl: UILabel!
    @IBOutlet weak var likeBtn: UIButton!
    @IBOutlet weak var commentBtn: UIButton!
    @IBOutlet weak var postCastImgView: UIImageView!
    
    weak var delegate: PodCastItemCellDelegate?
    
    var podCast: PodCast? {
        didSet {
            guard let postCast = podCast else { return }
            postCastImgView.kf.setImage(with: URL(string: postCast.background))
            avatarImageView.kf.setImage(with: URL(string: postCast.user.avatar))
            userNameLbl.text = postCast.user.username
            captionLbl.text = postCast.caption
            let likeIcon = (postCast.isLike ? UIImage.icLike : .icUnLike).styled(with: .font(.systemFont(ofSize: 15)), .baselineOffset(-5))
            let likeTitle = "\(postCast.likeCount) like".styled(with: .font(.systemFont(ofSize: 15)))
            likeBtn.setAttributedTitle(NSAttributedString.composed(of: [likeIcon, likeTitle], baseStyle: .init([.color(postCast.isLike ? .blue : .darkGray)]), separator: " "), for: .normal)
            commentBtn.setAttributedTitle("\(postCast.commentCount) comment".styled(with: .font(.systemFont(ofSize: 15)), .color(.darkGray)), for: .normal)
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
    
    @IBAction func tapComment(_ sender: Any) {
        delegate?.podCastItemCell(didTapCommentButtonInside: self)
    }
    @IBAction func tapLike(_ sender: Any) {
        delegate?.podCastItemCell(didTapLikeButtonInside: self)
    }
    
    @IBAction func tapDelete(_ sender: Any) {
        delegate?.podCastItemCell(didTapDeleteButtonInside: self)
    }
}
