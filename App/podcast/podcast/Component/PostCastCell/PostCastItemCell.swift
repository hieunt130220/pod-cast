//
//  PostCastItemCell.swift
//  podcast
//
//  Created by Nguyen Trung Hieu on 7/5/24.
//

import UIKit
protocol PostCastItemCellDelegate: AnyObject {
    func postCastItemCell(didTapLikeButtonInside cell: PostCastItemCell)
    func postCastItemCell(didTapCommentButtonInside cell: PostCastItemCell)
    func postCastItemCell(didTapPlayButtonInside cell: PostCastItemCell)
}

class PostCastItemCell: UITableViewCell {

    @IBOutlet weak var avatarImageView: UIImageView!
    @IBOutlet weak var userNameLbl: UILabel!
    @IBOutlet weak var captionLbl: UILabel!
    @IBOutlet weak var likeBtn: UIButton!
    @IBOutlet weak var commentBtn: UIButton!
    @IBOutlet weak var postCastImgView: UIImageView!
    
    weak var delegate: PostCastItemCellDelegate?
    
    var postCast: PostCast? {
        didSet {
            guard let postCast = postCast else { return }
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
        delegate?.postCastItemCell(didTapCommentButtonInside: self)
    }
    @IBAction func tapLike(_ sender: Any) {
        delegate?.postCastItemCell(didTapLikeButtonInside: self)
    }
    @IBAction func tapPlay(_ sender: Any) {
        delegate?.postCastItemCell(didTapPlayButtonInside: self)
    }
}
