import React, { useEffect } from 'react';

import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { openWelcomeModalAction, closeWelcomeModalAction } from '../actions/modalActions';
import { registerUserAction } from '../actions/userActions';
import Google from '../assets/google-icon.svg';
import Button from '../components/button/Button';
import ErrorMessage from '../components/errors/ErrorMessage';
import InlineErrorMessage from '../components/errors/InlineErrorMessage';
import {
    ModalButtonContainer
} from '../styling/ModalStyling';
import {
    SolidInput,
    StyledForm,
    StyledLabel
} from '../styling/PageStyling';
import {
    WelcomeContainer,
    AppTitle,
    CTA,
    SubActionContainer,
    SubAction,
    OauthProviders,
    StyledLink
} from '../styling/WelcomeStyling';

const Welcome = ({ registerAction, openModalAction, closeModalAction, showModal, errorMessage }) => {

    useEffect(() => {
        openModalAction();
    },[]);

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
            isOpen={showModal}
            onRequestClose={() => closeModalAction()}
            shouldCloseOnOverlayClick={false}
            closeTimeoutMS={200}
            contentLabel="modal">
            <AppTitle>Welcome to Ticket Punch</AppTitle>
            <CTA>{"Let's get started"}</CTA>

            <ErrorMessage error={errorMessage} />

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
                    <InlineErrorMessage inlineErrorMessage={errors.email.message} />
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
                    <InlineErrorMessage inlineErrorMessage={errors.password.message} />
                    : null}

                <ModalButtonContainer>
                    <Button
                        type="submit"
                        className="purple extended"
                        text={"Create Account"}
                    />
                </ModalButtonContainer>

            </StyledForm>

            <SubActionContainer>
                <SubAction>Or</SubAction>
                <OauthProviders>
                    <Button
                        className="white extended"
                        text={"Sign up with Google"}
                        alt={"Google"}
                        oAuth={true}
                        logo={Google}
                    />
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
    registerAction: PropTypes.func,
    openModalAction: PropTypes.func,
    closeModalAction: PropTypes.func,
    showModal: PropTypes.bool,
    errorMessage: PropTypes.string
};

const mapStateToProps = (state) => {
    return {
        showModal: state.modalReducer.showWelcomeModal,
        errorMessage: state.registrationReducer.error
    };
};

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        registerAction: registerUserAction,
        openModalAction: openWelcomeModalAction,
        closeModalAction: closeWelcomeModalAction
    }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(Welcome);
