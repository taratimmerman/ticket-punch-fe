import React, { useState } from 'react';

import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { MdError } from 'react-icons/md';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { registerUserAction } from '../actions/userActions';
import Google from '../assets/google-icon.svg';
import LinkedIn from '../assets/logo_linkedin.png';
import Slack from '../assets/logo_slack.png';
import {
    SolidButton,
    SolidInput,
    StyledForm,
    StyledLabel,
    InlineErrorWrapper,
    InlineErrorIcon,
    InlineError
} from '../styling/PageStyling';
import {
    WelcomeContainer,
    AppTitle,
    CTA,
    SubActionContainer,
    SubAction,
    OauthProviders,
    OauthProvider,
    ProviderName,
    OauthLogo,
    StyledLink
} from '../styling/WelcomeStyling';

const Welcome = ({ registerAction }) => {

    const [welcomeIsOpen, setWelcomeIsOpen] = useState(true);

    const { register, handleSubmit, formState: { errors } } = useForm({
        mode: "onBlur"
    });

    const handleRegistration = (user) => {
        const email = user.email.trim();
        const password = user.password.trim();

        registerAction(email, password);
    };
    const handleError = (errors) => console.log(errors);

    const RegistrationValidation = {
        email: {
            required: "Please enter a valid email address",
            pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Enter in the format: name@company.com"
            }
        },
        password: {
            required: "Please enter a password",
            minLength: {
                value: 6,
                message: "Passwords must be six or more characters"
            }
        }
    };

    return (
        <WelcomeContainer
            className="purple"
            isOpen={welcomeIsOpen}
            onRequestClose={() => setWelcomeIsOpen(true)}
            shouldCloseOnOverlayClick={false}
            closeTimeoutMS={200}
            contentLabel="modal">
            <AppTitle>Welcome to Ticket Punch</AppTitle>
            <CTA>{"Let's get started"}</CTA>

            <StyledForm onSubmit={handleSubmit(handleRegistration, handleError)}>
                <StyledLabel
                    htmlFor="email"
                >Enter email</StyledLabel>

                <SolidInput
                    type="email"
                    {...register('email', RegistrationValidation.email)}
                    name="email"
                    className={`purple ${errors.email ? "error" : null}`}
                    placeholder="name@company.com"
                />
                {errors.email ?
                    <InlineErrorWrapper>
                        <InlineErrorIcon>
                            <MdError />
                        </InlineErrorIcon>
                        <InlineError>{errors.email.message}</InlineError>
                    </InlineErrorWrapper>
                    : null}

                <StyledLabel
                    htmlFor="password"
                >Enter password</StyledLabel>

                <SolidInput
                    type="password"
                    {...register('password', RegistrationValidation.password)}
                    name="password"
                    className={`purple ${errors.password ? "error" : null}`}
                    placeholder="Choose a password"
                />
                {errors.password ?
                    <InlineErrorWrapper>
                        <InlineErrorIcon>
                            <MdError />
                        </InlineErrorIcon>
                        <InlineError>{errors.password.message}</InlineError>
                    </InlineErrorWrapper>
                    : null}


                <SolidButton
                    type="submit"
                    className="purple"
                >Create Account</SolidButton>

            </StyledForm>

            <SubActionContainer>
                <SubAction>Or sign up with</SubAction>
                <OauthProviders>
                    <OauthProvider>
                        <OauthLogo alt="Google" src={Google} />
                        <ProviderName>Google</ProviderName>
                    </OauthProvider>

                    <OauthProvider>
                        <OauthLogo alt="Slack" src={Slack} />
                        <ProviderName>Slack</ProviderName>
                    </OauthProvider>

                    <OauthProvider>
                        <OauthLogo alt="LinkedIn" src={LinkedIn} />
                        <ProviderName>LinkedIn</ProviderName>
                    </OauthProvider>
                </OauthProviders>
            </SubActionContainer>

            <SubAction
            >Already have an account?
                <StyledLink to='/login'>Log in</StyledLink>
            </SubAction>

        </WelcomeContainer>
    );
};

Welcome.propTypes = {
    registerAction: PropTypes.func
};

const mapStateToProps = (state) => {
    return { registering: state.registration };
};

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        registerAction: registerUserAction
    }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(Welcome);
