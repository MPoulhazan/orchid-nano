import React from 'react';
import './Home.scss';
import { useEffect } from 'react';
import { withRouter } from 'react-router';
import FormCard from '../shared/component/formCard/FormCard';
import Logo from '../shared/component/logo/Logo';

const Home = () => {
    useEffect(() => {}, []);

    return (
        <div className="Home">
            <Logo />
            <FormCard />
        </div>
    );
};

export default withRouter(Home);
