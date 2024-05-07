//
//  ReuseableView+ext.swift
//  podcast
//
//  Created by Nguyen Trung Hieu on 7/5/24.
//

import UIKit
extension UITableView {
    
    func dequeueReusableCell<T: UITableViewCell>(_ cellType: T.Type, for indexPath: IndexPath) -> T {
        if let cell = dequeueReusableCell(withIdentifier: cellType.className, for: indexPath) as? T {
            return cell
        } else {
            fatalError("Couldn't dequeueReusableCell \(cellType.className)")
        }
    }
    func registerNib<T: UITableViewCell>(_ cellType: T.Type) {
        let nib = UINib(nibName: cellType.className, bundle: nil)
        register(nib, forCellReuseIdentifier: cellType.className)
    }
}

extension UICollectionView {
    
    func registerCell<T: UICollectionViewCell>(_ cellType: T.Type) {
        register(cellType.self, forCellWithReuseIdentifier: cellType.className)
    }
    
    func registerNib<T: UICollectionViewCell>(_ cellType: T.Type) {
        let nib = UINib(nibName: cellType.className, bundle: nil)
        register(nib, forCellWithReuseIdentifier: cellType.className)
    }
    
    func registerHeader<T: UICollectionReusableView>(_ cellType: T.Type) {
        let nib = UINib(nibName: cellType.className, bundle: nil)
        register(nib, forSupplementaryViewOfKind: UICollectionView.elementKindSectionHeader, withReuseIdentifier: cellType.className)
    }
    
    func registerFooter<T: UICollectionReusableView>(_ cellType: T.Type) {
        let nib = UINib(nibName: cellType.className, bundle: nil)
        register(nib, forSupplementaryViewOfKind: UICollectionView.elementKindSectionFooter, withReuseIdentifier: cellType.className)
    }
    
    func dequeueReusableCell<T: UICollectionViewCell>(_ cellType: T.Type, for indexPath: IndexPath) -> T {
        if let cell = dequeueReusableCell(withReuseIdentifier: cellType.className, for: indexPath) as? T {
            return cell
        } else {
            fatalError("Couldn't dequeueReusableCell \(cellType.className)")
        }
    }
    
    func dequeueReusableHeader<T: UICollectionReusableView>(_ cellType: T.Type, for indexPath: IndexPath) -> T {
        if let cell = dequeueReusableSupplementaryView(ofKind: UICollectionView.elementKindSectionHeader, withReuseIdentifier: cellType.className, for: indexPath) as? T {
            return cell
        } else {
            fatalError("Couldn't dequeueReusableCell \(cellType.className)")
        }
    }
    
    func dequeueReusableFooter<T: UICollectionReusableView>(_ cellType: T.Type, for indexPath: IndexPath) -> T {
        if let cell = dequeueReusableSupplementaryView(ofKind: UICollectionView.elementKindSectionFooter, withReuseIdentifier: cellType.className, for: indexPath) as? T {
            return cell
        } else {
            fatalError("Couldn't dequeueReusableCell \(cellType.className)")
        }
    }
}
