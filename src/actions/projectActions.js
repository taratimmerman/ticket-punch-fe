import { API_URL, axiosWithAuth } from '../helpers/axiosWithAuth';
import { DELETE_REQUEST, UPDATE_REQUEST } from './userActions';

// PROJECT ACTION TYPES (CONSTANTS)

export const GETALL_REQUEST = 'PROJECTS_GETALL_REQUEST';
export const GETALL_SUCCESS = 'PROJECTS_GETALL_SUCCESS';
export const GETALL_FAILURE = 'PROJECTS_GETALL_FAILURE';

export const GETPROJECT_REQUEST = 'PROJECTS_GETPROJECT_REQUEST';
export const GETPROJECT_SUCCESS = 'PROJECTS_GETPROJECT_SUCCESS';
export const GETPROJECT_FAILURE = 'PROJECTS_GETPROJECT_FAILURE';

export const CREATEPROJECT_REQUEST = 'PROJECTS_CREATEPROJECT_REQUEST';
export const CREATEPROJECT_SUCCESS = 'PROJECTS_CREATEPROJECT_SUCCESS';
export const CREATEPROJECT_FAILURE = 'PROJECTS_CREATEPROJECT_FAILURE';

export const UPDATEPROJECT_REQUEST = 'PROJECTS_UPDATEPROJECT_REQUEST';
export const UPDATEPROJECT_SUCCESS = 'PROJECTS_UPDATEPROJECT_SUCCESS';
export const UPDATEPROJECT_FAILURE = 'PROJECTS_UPDATEPROJECT_FAILURE';

export const DELETEPROJECT_REQUEST = 'PROJECTS_DELETEPROJECT_REQUEST';
export const DELETEPROJECT_SUCCESS = 'PROJECTS_DELETEPROJECT_SUCCESS';
export const DELETEPROJECT_FAILURE = 'PROJECTS_DELETEPROJECT_FAILURE';

// PROJECT ACTION CREATORS

export const getAllProjectsByUserAction = userId => dispatch => {
    dispatch({ type: GETALL_REQUEST });

    axiosWithAuth()
        .get(`${API_URL}/projects/user/${userId}`)
        .then(res => {
            dispatch({
                type: GETALL_SUCCESS,
                payload: res.data
            });
        })
        .catch(err => {
            dispatch({
                type: GETPROJECT_FAILURE,
                payload: err.message
            });
        });
};

export const getProjectByIdAction = projectId => dispatch => {
    dispatch({ type: GETPROJECT_REQUEST });

    axiosWithAuth()
        .get(`${API_URL}/projects/${projectId}`)
        .then(res => {
            dispatch({
                type: GETPROJECT_SUCCESS,
                payload: res.data
            });
        })
        .catch(err => {
            dispatch({
                type: GETPROJECT_FAILURE,
                payload: err.message
            });
        });
};

export const createProjectAction = newProject => dispatch => {
    dispatch({ type: CREATEPROJECT_REQUEST });

    axiosWithAuth()
        .post(`${API_URL}/projects`, newProject)
        .then(res => {
            dispatch({
                type: CREATEPROJECT_SUCCESS,
                payload: res.data
            });
        })
        .catch(err => {
            dispatch({
                type: CREATEPROJECT_FAILURE,
                payload: err.message
            });
        });
};

export const editProjectAction = (projectId, projectEdits) => dispatch => {
    dispatch({ type: UPDATE_REQUEST });

    axiosWithAuth()
        .put(`${API_URL}/projects/${projectId}`, projectEdits)
        .then(res => {
            dispatch({
                type: UPDATEPROJECT_SUCCESS,
                payload: res.data
            });
        })
        .catch(err => {
            dispatch({
                type: UPDATEPROJECT_FAILURE,
                payload: err.message
            });
        });
};

export const deleteProjectAction = projectId => dispatch => {
    dispatch({ type: DELETE_REQUEST });

    axiosWithAuth()
        .delete(`${API_URL}/projects/${projectId}`)
        .then(res => {
            dispatch({
                type: DELETEPROJECT_SUCCESS,
                payload: res.data
            });
        })
        .catch(err => {
            dispatch({
                type: DELETEPROJECT_FAILURE,
                payload: err.message
            });
        });
};