import Foundation
import  UIKit
var activityIndicatorViewAssociativeKey = "activityIndicatorViewAssociativeKey"

public class RCLoadingView: UIActivityIndicatorView {
    
}

public extension UIView {
    var activityIndicatorView: RCLoadingView {
        get {
            if let activityIndicatorView = objc_getAssociatedObject(self, &activityIndicatorViewAssociativeKey) as? RCLoadingView {
                bringSubviewToFront(activityIndicatorView)
                return activityIndicatorView
            } else {
                let activityIndicatorView: RCLoadingView = RCLoadingView()
                activityIndicatorView.layer.cornerRadius = 5
                activityIndicatorView.backgroundColor = .init(white: 0, alpha: 0.5)
                activityIndicatorView.style = .large
                activityIndicatorView.color = .white
                activityIndicatorView.translatesAutoresizingMaskIntoConstraints = false
                addSubview(activityIndicatorView)
                bringSubviewToFront(activityIndicatorView)
                NSLayoutConstraint.activate([
                    activityIndicatorView.centerYAnchor.constraint(equalTo: self.centerYAnchor, constant: 0),
                    activityIndicatorView.centerXAnchor.constraint(equalTo: self.centerXAnchor, constant: 0),
                    activityIndicatorView.widthAnchor.constraint(equalToConstant: 80),
                    activityIndicatorView.widthAnchor.constraint(equalTo: activityIndicatorView.heightAnchor, multiplier: 1, constant: 0)
                    
                ])
                
                objc_setAssociatedObject(self, &activityIndicatorViewAssociativeKey, activityIndicatorView, objc_AssociationPolicy.OBJC_ASSOCIATION_RETAIN_NONATOMIC)
                return activityIndicatorView
            }
        }
        
        set {
            addSubview(newValue)
            bringSubviewToFront(activityIndicatorView)
            objc_setAssociatedObject(self, &activityIndicatorViewAssociativeKey, newValue, objc_AssociationPolicy.OBJC_ASSOCIATION_RETAIN_NONATOMIC)
        }
        
    }
    
    @discardableResult
    func fromNib<T: UIView>() -> T? {
        guard let view = Bundle.main.loadNibNamed(String(describing: type(of: self)), owner: self, options: nil)?[0] as? T else {
            // xib not loaded, or it's top view is of the wrong type
            return nil
        }
        view.frame = bounds
        self.addSubViewWithConstraints(subView: view)
        return view
    }
    
    func addSubViewWithConstraints(subView: UIView, padding: CGFloat = 0, topOffset: CGFloat? = 0) {
        if subView.superview == nil {
            subView.translatesAutoresizingMaskIntoConstraints = false
            self.addSubview(subView)
            self.bringSubviewToFront(subView)
            NSLayoutConstraint.activate([
                subView.topAnchor.constraint(equalTo: self.topAnchor, constant: topOffset ?? padding),
                subView.bottomAnchor.constraint(equalTo: self.bottomAnchor, constant: padding),
                subView.leadingAnchor.constraint(equalTo: self.leadingAnchor, constant: padding),
                subView.trailingAnchor.constraint(equalTo: self.trailingAnchor, constant: padding)
            ])
        }
    }
    
    /** This is the function to get subViews of a view of a particular type
     */
    func subViews<T: UIView>(type: T.Type) -> [T] {
        var all = [T]()
        for view in self.subviews {
            if let aView = view as? T {
                all.append(aView)
            }
        }
        return all
    }
    
    /** This is a function to get subViews of a particular type from view recursively. It would look recursively in all subviews and return back the subviews of the type T */
    func allSubViewsOf<T: UIView>(type: T.Type) -> [T] {
        var all = [T]()
        func getSubview(view: UIView) {
            if let aView = view as? T {
                all.append(aView)
            }
            guard view.subviews.count>0 else { return }
            view.subviews.forEach { getSubview(view: $0) }
        }
        getSubview(view: self)
        return all
    }
}

extension UIView {
    /// The radius of the view's rounded corners
    @IBInspectable public var cornerRadii: CGFloat {
        get {
            return layer.cornerRadius
        }
        set {
            layer.cornerRadius = newValue
        }
    }
    
    /// The width of the border applied to the view
    @IBInspectable public var borderWidth: CGFloat {
        get {
            return layer.borderWidth
        }
        set {
            layer.borderWidth = newValue
        }
    }
    
    /// The color of the border applied to the views
    @IBInspectable public var borderColor: UIColor {
        get {
            return UIColor(cgColor: layer.borderColor!)
        }
        set {
            layer.borderColor = newValue.cgColor
        }
    }
}

extension UIView {
    func loadNib() -> UIView {
        let bundle = Bundle(for: type(of: self))
        let nibName = type(of: self).description().components(separatedBy: ".").last!
        let nib = UINib(nibName: nibName, bundle: bundle)
        return nib.instantiate(withOwner: self, options: nil).first as? UIView ?? UIView()
    }
    
    func setGradient(colors: [UIColor], start: CGPoint, end: CGPoint) {
        self.layer.masksToBounds = true;
        self.autoresizingMask = [.flexibleWidth, .flexibleHeight]
        let gradient = CAGradientLayer()
        gradient.frame = self.bounds
        gradient.startPoint = start
        gradient.endPoint = end
        var arr = [CGColor]()
        colors.forEach({arr.append($0.cgColor)})
        gradient.colors = arr;
        self.layer.insertSublayer(gradient, at: 0)
    }
    
    func corner(radius: CGFloat, corners: UIRectCorner) {
        let path = UIBezierPath(roundedRect: self.bounds, byRoundingCorners: corners, cornerRadii: CGSize(width: radius, height: radius))
        let mask = CAShapeLayer()
        mask.path = path.cgPath
        layer.mask = mask
    }
}
extension UIStackView {
    func addArrangedSubviews(_ subviews: [UIView]) {
        subviews.forEach { addArrangedSubview($0) }
    }
}
