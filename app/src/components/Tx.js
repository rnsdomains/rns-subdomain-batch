import React from 'react';

export default ({ tx }) => <a href={`${process.env.REACT_APP_RSK_EXPLORER}/tx/${tx}`}>{tx}</a>;
