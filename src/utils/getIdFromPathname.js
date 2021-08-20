const getIdFromPathname = (pathname) => {
    const s = pathname.split('/');
    const id = s[s.length - 1];
    return id.length === 24 ? id : null;
};

export default getIdFromPathname;
