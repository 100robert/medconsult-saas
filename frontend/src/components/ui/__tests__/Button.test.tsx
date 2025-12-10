import { render, screen, fireEvent } from '@testing-library/react';
import Button from '../Button';

describe('Button Component', () => {
    // Test 1: Renderiza correctamente con texto
    it('renders children correctly', () => {
        render(<Button>Click me</Button>);
        expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
    });

    // Test 2: Aplica la variante primary por defecto
    it('applies primary variant by default', () => {
        render(<Button>Primary</Button>);
        const button = screen.getByRole('button');
        expect(button.className).toContain('bg-teal');
    });

    // Test 3: Aplica variante danger correctamente
    it('applies danger variant correctly', () => {
        render(<Button variant="danger">Delete</Button>);
        const button = screen.getByRole('button');
        expect(button.className).toContain('bg-red');
    });

    // Test 4: Muestra spinner cuando isLoading=true
    it('shows loading spinner when isLoading is true', () => {
        render(<Button isLoading>Loading</Button>);
        const button = screen.getByRole('button');
        expect(button).toBeDisabled();
        // El spinner tiene la clase animate-spin
        expect(button.querySelector('.animate-spin')).toBeInTheDocument();
    });

    // Test 5: Está deshabilitado cuando disabled=true
    it('is disabled when disabled prop is true', () => {
        render(<Button disabled>Disabled</Button>);
        expect(screen.getByRole('button')).toBeDisabled();
    });

    // Test 6: Llama onClick cuando se hace click
    it('calls onClick handler when clicked', () => {
        const handleClick = jest.fn();
        render(<Button onClick={handleClick}>Click</Button>);

        fireEvent.click(screen.getByRole('button'));
        expect(handleClick).toHaveBeenCalledTimes(1);
    });

    // Test 7: No llama onClick cuando está deshabilitado
    it('does not call onClick when disabled', () => {
        const handleClick = jest.fn();
        render(<Button onClick={handleClick} disabled>Click</Button>);

        fireEvent.click(screen.getByRole('button'));
        expect(handleClick).not.toHaveBeenCalled();
    });

    // Test 8: Renderiza leftIcon
    it('renders leftIcon when provided', () => {
        render(
            <Button leftIcon={<span data-testid="left-icon">←</span>}>
                With Icon
            </Button>
        );
        expect(screen.getByTestId('left-icon')).toBeInTheDocument();
    });

    // Test 9: Renderiza rightIcon
    it('renders rightIcon when provided', () => {
        render(
            <Button rightIcon={<span data-testid="right-icon">→</span>}>
                With Icon
            </Button>
        );
        expect(screen.getByTestId('right-icon')).toBeInTheDocument();
    });

    // Test 10: Aplica tamaños correctamente
    it('applies size classes correctly', () => {
        const { rerender } = render(<Button size="sm">Small</Button>);
        expect(screen.getByRole('button').className).toContain('px-4');

        rerender(<Button size="lg">Large</Button>);
        expect(screen.getByRole('button').className).toContain('px-8');
    });
});
