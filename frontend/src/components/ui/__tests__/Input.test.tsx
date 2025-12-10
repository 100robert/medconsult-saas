import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Input from '../Input';

describe('Input Component', () => {
    // Test 1: Renderiza input básico
    it('renders a basic input', () => {
        render(<Input placeholder="Enter text" />);
        expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument();
    });

    // Test 2: Renderiza label cuando se proporciona
    it('renders label when provided', () => {
        render(<Input label="Email" name="email" />);
        expect(screen.getByText('Email')).toBeInTheDocument();
        expect(screen.getByLabelText('Email')).toBeInTheDocument();
    });

    // Test 3: Muestra mensaje de error
    it('shows error message when error prop is provided', () => {
        render(<Input error="This field is required" />);
        expect(screen.getByText('This field is required')).toBeInTheDocument();
    });

    // Test 4: Muestra helperText cuando no hay error
    it('shows helper text when no error', () => {
        render(<Input helperText="Enter your email address" />);
        expect(screen.getByText('Enter your email address')).toBeInTheDocument();
    });

    // Test 5: No muestra helperText cuando hay error
    it('does not show helper text when there is an error', () => {
        render(
            <Input
                helperText="Enter your email address"
                error="Invalid email"
            />
        );
        expect(screen.queryByText('Enter your email address')).not.toBeInTheDocument();
        expect(screen.getByText('Invalid email')).toBeInTheDocument();
    });

    // Test 6: Renderiza leftIcon
    it('renders left icon when provided', () => {
        render(
            <Input leftIcon={<span data-testid="left-icon">📧</span>} />
        );
        expect(screen.getByTestId('left-icon')).toBeInTheDocument();
    });

    // Test 7: Renderiza rightIcon
    it('renders right icon when provided', () => {
        render(
            <Input rightIcon={<span data-testid="right-icon">👁</span>} />
        );
        expect(screen.getByTestId('right-icon')).toBeInTheDocument();
    });

    // Test 8: Está deshabilitado cuando disabled=true
    it('is disabled when disabled prop is true', () => {
        render(<Input disabled placeholder="Disabled" />);
        expect(screen.getByPlaceholderText('Disabled')).toBeDisabled();
    });

    // Test 9: Acepta input del usuario
    it('accepts user input', async () => {
        const user = userEvent.setup();
        render(<Input placeholder="Type here" />);

        const input = screen.getByPlaceholderText('Type here');
        await user.type(input, 'Hello World');

        expect(input).toHaveValue('Hello World');
    });

    // Test 10: Tiene aria-invalid cuando hay error
    it('has aria-invalid when error is present', () => {
        render(<Input error="Error message" placeholder="Test" />);
        expect(screen.getByPlaceholderText('Test')).toHaveAttribute('aria-invalid', 'true');
    });

    // Test 11: Aplica variante glass correctamente
    it('applies glass variant correctly', () => {
        render(<Input variant="glass" placeholder="Glass input" />);
        const input = screen.getByPlaceholderText('Glass input');
        expect(input.className).toContain('backdrop-blur');
    });
});
