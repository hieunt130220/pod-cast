//
//  OtherUserHeaderView.swift
//  podcast
//
//  Created by Nguyen Trung Hieu on 21/5/24.
//

import UIKit

protocol OtherUserHeaderViewDelegate: AnyObject {
    func otherUserHeaderView(didTapFollowBtnInside view: OtherUserHeaderView)
}

class OtherUserHeaderView: UIView {

    @IBOutlet weak var followBtn: FollowButton!
    @IBOutlet weak var avatarImageView: UIImageView!
    @IBOutlet weak var userNameLbl: UILabel!
    @IBOutlet weak var followersBtn: UIButton!
    @IBOutlet weak var followingBtn: UIButton!
    
    
    weak var delegate: OtherUserHeaderViewDelegate?
    
    var user: User? {
        didSet {
            guard let user = user else { return }
            avatarImageView.kf.setImage(with: URL(string: user.avatar))
            userNameLbl.text = user.username
            followersBtn.setAttributedTitle("\(user.followers) followers".styled(with: .font(.systemFont(ofSize: 15))), for: .normal)
            followingBtn.setAttributedTitle("\(user.followings) following".styled(with: .font(.systemFont(ofSize: 15))), for: .normal)
            followBtn.isFollow = user.isFollowing
            print("hieunt == \(user.isFollowing)")
        }
    }
    
    override init(frame: CGRect) {
        super.init(frame: frame)
        setupUI()
    }
    
    required init?(coder: NSCoder) {
        super.init(coder: coder)
        setupUI()
    }
    
    func setupUI() {
        fromNib()
    }
    
    @IBAction func tapFollow(_ sender: Any) {
        delegate?.otherUserHeaderView(didTapFollowBtnInside: self)
    }
    @IBAction func tapFollowing(_ sender: Any) {
        
    }
    
    @IBAction func tapFollower(_ sender: Any) {
    }
}
