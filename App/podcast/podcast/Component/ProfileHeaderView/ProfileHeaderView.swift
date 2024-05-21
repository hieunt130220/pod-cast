//
//  ProfileHeaderView.swift
//  podcast
//
//  Created by Nguyen Trung Hieu on 7/5/24.
//

import UIKit
import Kingfisher

protocol ProfileHeaderViewDelegate: AnyObject {
    func profileHeaderView(didTapChangeAvatarInside view: ProfileHeaderView)
    func profileHeaderView(didTapEditNameInside view: ProfileHeaderView)
}

class ProfileHeaderView: UIView {

    @IBOutlet weak var editName: UIButton!
    @IBOutlet weak var changeAvatar: UIButton!
    @IBOutlet weak var avatarImageView: UIImageView!
    @IBOutlet weak var userNameLbl: UILabel!
    @IBOutlet weak var followersBtn: UIButton!
    @IBOutlet weak var followingBtn: UIButton!
    
    weak var delegate: ProfileHeaderViewDelegate?
    
    var user: User? {
        didSet {
            guard let user = user else { return }
            avatarImageView.kf.setImage(with: URL(string: user.avatar))
            userNameLbl.text = user.username
            followersBtn.setAttributedTitle("\(user.followers) followers".styled(with: .font(.systemFont(ofSize: 15))), for: .normal)
            followingBtn.setAttributedTitle("\(user.followings) following".styled(with: .font(.systemFont(ofSize: 15))), for: .normal)
            
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
    
    @IBAction func tapEditName(_ sender: Any) {
        delegate?.profileHeaderView(didTapEditNameInside: self)
    }
    @IBAction func tapChangeAvatar(_ sender: Any) {
        delegate?.profileHeaderView(didTapChangeAvatarInside: self)
    }
    @IBAction func tapFollowing(_ sender: Any) {
    }
    
    @IBAction func tapFollower(_ sender: Any) {
    }
}
