import React from 'react';
import { FormattedMessage } from 'react-intl';

import A from './A';
import Img from './Img';
import NavBar from './NavBar';
import HeaderLink from './HeaderLink';
import CenteredSection from '../../containers/HomePage/CenteredSection';
import H2 from '../H2';
import Banner from './logo.png';
import messages from './messages';

function Header() {
  return (
    <div>
      <A href="https://www.reactboilerplate.com/">
        <Img src={Banner} alt="react-boilerplate - Logo" />
      </A>
      <div>
        <CenteredSection>
          <H2>
            <FormattedMessage {...messages.startAssignmentHeader} />
          </H2>
          <p>
            <FormattedMessage {...messages.startAssignmentMessage} />
          </p>
        </CenteredSection>
      </div>
      <NavBar>
        <HeaderLink to="/">
          <FormattedMessage {...messages.part1} />
        </HeaderLink>
        <HeaderLink to="/features">
          <FormattedMessage {...messages.part2} />
        </HeaderLink>
      </NavBar>
    </div>
  );
}

export default Header;
