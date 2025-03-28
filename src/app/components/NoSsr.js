"use client";

import dynamic from "next/dynamic";

const NoSsr = ({ children }) => <>{children}</>;

export default dynamic(() => Promise.resolve(NoSsr), { ssr: false });

/**
Nếu hiện lỗi tương tự như thế này thì wrap children trong thằng NoSsr này:

Warning: Prop `className` did not match. when using styled components with semantic-ui-react

Tham khảo: https://stackoverflow.com/questions/51791163/warning-prop-classname-did-not-match-when-using-styled-components-with-seman


*/
