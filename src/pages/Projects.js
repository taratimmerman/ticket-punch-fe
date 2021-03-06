import React, { useEffect } from 'react';

import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { GiBoxingGlove } from 'react-icons/gi';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { openAddProjectModalAction, closeAddProjectModalAction } from '../actions/modalActions';
import { createProjectAction, getAllProjectsByUserAction, targetProjectAction } from '../actions/projectActions';
import Button from '../components/button/Button';
import ErrorMessage from '../components/errors/ErrorMessage';
import InlineErrorMessage from '../components/errors/InlineErrorMessage';
import ProjectCard from '../components/ProjectCard';
import { getUserId } from '../helpers/getUserInfo';
import {
    ModalAction,
    ModalContainer,
    ModalCircle,
    ModalButtonContainer
} from '../styling/ModalStyling';
import {
    PageContainer,
    PageTitleWrapper,
    PageTitle,
    KanbanContainer,
    Bar,
    StatusTitle,
    CardContainer,
    SolidInput,
    StyledForm,
    StyledLabel,
    SolidDropdown,
    SolidTextArea
} from '../styling/PageStyling';

const Projects = ({ getAllProjectsAction, projects, createProjectAction, openModalAction, closeModalAction, showModal, targetProjectAction, errorMessage, isEditing, isDeleting }) => {

    useEffect(() => {
        getAllProjectsAction(getUserId());
    }, []);

    const { register, handleSubmit, reset, formState: { errors } } = useForm({
        mode: "onBlur"
    });

    const handleCreateProject = (newProject) => {
        const user_id = getUserId();
        const title = newProject.title.trim();
        const description = newProject.description.trim();
        const status = newProject.status.trim();

        createProjectAction(user_id, title, description, status);
        reset();
    };

    const handleError = (errors) => console.log(errors);

    const newProjectValidation = {
        title: {
            required: "Please enter the project title",
            maxLength: {
                value: 30,
                message: "Project titles must be less than 30 characters"
            }
        },
        description: {
            required: "Please enter the project description",
            maxLength: {
                value: 140,
                message: "Project descriptions must be less than 30 characters"
            }
        }
    };

    return (
        <PageContainer className="page">
            <PageTitleWrapper>
                <PageTitle>Projects</PageTitle>
                <Button onClick={() => openModalAction()} text={"New Project"} className={"purple"} />
            </PageTitleWrapper>

            {/* New Project Modal */}
            <ModalContainer
                className="green"
                isOpen={showModal}
                onRequestClose={() => closeModalAction()}
                closeTimeoutMS={200}
                contentLabel="modal"
            >
                <ModalCircle className="green">
                    <GiBoxingGlove />
                </ModalCircle>
                <ModalAction>Add Project</ModalAction>

                <ErrorMessage error={errorMessage} />

                <StyledForm onSubmit={handleSubmit(handleCreateProject, handleError)}>
                    <StyledLabel
                        htmlFor="title"
                    >Project Title</StyledLabel>

                    <SolidInput
                        type="text"
                        {...register('title', newProjectValidation.title)}
                        name="title"
                        className={`${errors.title ? "error" : null}`}
                        placeholder="Enter the project title"
                    />
                    {errors.title ?
                        <InlineErrorMessage inlineErrorMessage={errors.title.message} />
                        : null}

                    <StyledLabel
                        htmlFor="status"
                    >Project Status</StyledLabel>

                    <SolidDropdown
                        name="status"
                        {...register('status')}
                    >
                        <option>---</option>
                        <option value="working_on_it">Working on it</option>
                        <option value="done">Done</option>
                    </SolidDropdown>

                    <StyledLabel
                        htmlFor="description"
                    >Project Description</StyledLabel>

                    <SolidTextArea
                        type="text"
                        {...register('description', newProjectValidation.description)}
                        name="description"
                        placeholder="Enter the project description"
                    />
                    {errors.description ?
                        <InlineErrorMessage inlineErrorMessage={errors.description.message} />
                        : null}

                    <ModalButtonContainer>
                        <Button
                            type="submit"
                            className="green"
                            text={"Add Project"}
                        />
                    </ModalButtonContainer>

                </StyledForm>

                <ModalButtonContainer>
                    <Button
                        className="green secondary"
                        onClick={() => closeModalAction()}
                        text={"Cancel"}
                    />
                </ModalButtonContainer>

            </ModalContainer>

            <KanbanContainer>
                <Bar className="working-on-it">
                    <StatusTitle>Working on it</StatusTitle>
                    <CardContainer>
                        {projects.filter(project => (
                            project.status === "working_on_it"
                        )).map(project => (
                            <div
                                key={project.id}
                                onClick={() => isEditing || isDeleting ? null : targetProjectAction(project.id, project.title, project.description, project.status)}
                            >
                                <ProjectCard key={project.id} id={project.id} title={project.title} description={project.description} status={project.status} />
                            </div>
                        ))}
                    </CardContainer>
                </Bar>
                <Bar className="done">
                    <StatusTitle>Done</StatusTitle>
                    <CardContainer>
                        {projects.filter(project => (
                            project.status === "done"
                        )).map(project => (
                            <div
                                key={project.id}
                                onClick={() => isEditing || isDeleting ? null : targetProjectAction(project.id, project.title, project.description, project.status)}
                            >
                                <ProjectCard key={project.id} id={project.id} title={project.title} description={project.description} status={project.status} />
                            </div>
                        ))}
                    </CardContainer>
                </Bar>
            </KanbanContainer>
        </PageContainer>
    );
};

Projects.propTypes = {
    getAllProjectsAction: PropTypes.func,
    projects: PropTypes.array,
    createProjectAction: PropTypes.func,
    openModalAction: PropTypes.func,
    closeModalAction: PropTypes.func,
    showModal: PropTypes.bool,
    targetProjectAction: PropTypes.func,
    errorMessage: PropTypes.string,
    isEditing: PropTypes.bool,
    isDeleting: PropTypes.bool
};

const mapStateToProps = (state) => {
    return {
        projects: state.projectReducer.projects,
        showModal: state.modalReducer.showAddProjectModal,
        errorMessage: state.projectReducer.error,
        isEditing: state.modalReducer.showEditProjectModal,
        isDeleting: state.modalReducer.showDeleteProjectModal
    };
};

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        getAllProjectsAction: getAllProjectsByUserAction,
        createProjectAction: createProjectAction,
        openModalAction: openAddProjectModalAction,
        closeModalAction: closeAddProjectModalAction,
        targetProjectAction: targetProjectAction
    }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(Projects);