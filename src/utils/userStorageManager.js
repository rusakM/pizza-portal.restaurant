const userStorageManager = {
    getCurrentUser: () => {
        let user = localStorage.getItem('currentUser');
        const expiryTime = parseInt(localStorage.getItem('loginExpires'));
        if (!user || !expiryTime) {
            return null;
        }
        if (expiryTime < Date.now()) {
            localStorage.removeItem('currentUser');
            localStorage.removeItem('loginExpires');
            return null;
        }
        return JSON.parse(user);
    },
    setNewLogin: (currentUser, expiry) => {
        try {
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            localStorage.setItem('loginExpires', `${expiry}`);
            return true;
        } catch {
            return false;
        }
    },
    logOut: () => {
        try {
            localStorage.removeItem('currentUser');
            localStorage.removeItem('loginExpires');
            return true;
        } catch {
            return false;
        }
    },
    isUserLoggedIn: () => {
        let user = localStorage.getItem('currentUser');
        const expiryTime = parseInt(localStorage.getItem('loginExpires'));
        if (!user || !expiryTime) {
            return false;
        }
        if (expiryTime > Date.now()) {
            return true;
        }
        return false;
    },
    getExpirationTime: () => {
        const expires = parseInt(localStorage.getItem('loginExpires'));
        if (expires) {
            return expires;
        }
        return null;
    },
};

export default userStorageManager;
