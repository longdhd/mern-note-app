import { useForm } from 'react-hook-form';
import { User } from '../models/user';
import { LoginCredentials } from '../network/users_api';
import * as UserApi from '../network/users_api';
import { Alert, Button, Form, Modal } from 'react-bootstrap';
import TextInputField from './form/TextInputField';
import styleUtils from '../styles/utils.module.css';
import { useState } from 'react';
import { UnauthorizedError } from '../errors/http_errors';

interface LoginModalProps {
    onDismiss: () => void,
    onLoginSuccessfully: (user: User) => void
}

const LoginModal = ({ onDismiss, onLoginSuccessfully }: LoginModalProps) => {
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginCredentials>();
    const [errorMessage, setErrorMassage]  = useState<string | null>(null)
    async function onSubmit(credentials: LoginCredentials){
        try {
            const newUser = await UserApi.login(credentials);
            onLoginSuccessfully(newUser);

        } catch (error) {
            if(error instanceof UnauthorizedError){
                setErrorMassage(error.message);
            }else{
                alert(error);
            }
            console.error(error);
        }
    }
    return (
        <Modal show onHide={onDismiss}>
            <Modal.Header>
                <Modal.Title>Sign Up</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit(onSubmit)}>
                <TextInputField
                        name="username"
                        label="Username"
                        type='text'
                        placeholder='Username'
                        register={register}
                        registerOptions={{ required: "Required" }}
                        error={errors.username}
                    />
                <TextInputField
                        name="password"
                        label="Password"
                        type='password'
                        placeholder='Password'
                        register={register}
                        registerOptions={{ required: "Required" }}
                        error={errors.password}
                    />
                {errorMessage &&
                    <Alert variant='danger' style={{margin:'8px 0'}}>
                        {errorMessage}
                    </Alert>
                }
                <Button type="submit" disabled={isSubmitting} className={styleUtils.w100}>
                    Log in
                </Button>
                </Form>
            </Modal.Body>
        </Modal>
    )
}

export default LoginModal