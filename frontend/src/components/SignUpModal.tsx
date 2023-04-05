import { useForm } from 'react-hook-form';
import { User } from '../models/user';
import { SignUpCredentials } from '../network/users_api';
import * as UserApi from '../network/users_api';
import { Alert, Button, Form, Modal } from 'react-bootstrap';
import TextInputField from './form/TextInputField';
import styleUtils from '../styles/utils.module.css';
import { useState } from 'react';
import { ConflictError } from '../errors/http_errors';

interface SignUpModalProps {
    onDismiss: () => void,
    onSignUpSuccessfully: (user: User) => void
}

const SignUpModal = ({ onDismiss, onSignUpSuccessfully }: SignUpModalProps) => {
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<SignUpCredentials>();
    const [errorMessage, setErrorMassage]  = useState<string | null>(null)
    async function onSubmit(credentials: SignUpCredentials){
        try {
            const newUser = await UserApi.signUp(credentials);
            onSignUpSuccessfully(newUser);

        } catch (error) {
            if(error instanceof ConflictError){
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
                        name="email"
                        label="Email"
                        type='email'
                        placeholder='Email'
                        register={register}
                        registerOptions={{ required: "Required" }}
                        error={errors.email}
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
                    Sign up
                </Button>
                </Form>
            </Modal.Body>
        </Modal>
    )
}

export default SignUpModal