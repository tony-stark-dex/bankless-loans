const Button = {
    baseStyle: {
        fontWeight: "medium",
        boxSizing: "border-box",
        mx: "20px"
    },
    sizes: {
        primary:{
            px: {
                base: "20px",
                md: "28px",
                lg: "51px",
            },
            py: {
                base: "12px",
                md: "14px",
                lg: "23px"
            },
            borderRadius: {
                base: "13px",
                md: "13px",
                lg: "24px",
            },
            fontSize: {
                base: "18px",
                md: "18px",
                lg: "24px"
            },
            lineHeight: "22px"
        },
        secondary: {
            px: "20px",
            py: "10px",
            borderRadius: "13px",
            fontSize: "1rem",
            lineHeight: "1.225",
        }
    },
    variants: { // TODO: Relative units
        solid: ({ onDark }: { onDark?: boolean }) => ({
            bg: !onDark ? "interactive.dark": "none",
            color: "interactive.white",
            border: !onDark ? "none" : "2px solid",
            borderColor: !onDark ? "rgba(0,0,0,0)": "interactive.purple",
            _hover: {
                bg: "interactive.darkPurple"
            },
            _active: {
                bg: !onDark ? "interactive.dark" : "interactive.darkPurple"
            },
            _disabled: {
                bg: "interactive.gray",
                color: "interactive.transparentWhite"
            }
        }),
        outline: {
            bg: "none",
            color: "interactive.dark",
            border: "2px solid",
            _hover: {
                bg: "interactive.darkPurple",
                color: "interactive.white",
                border: "2px solid",
                borderColor: "rgba(0,0,0,0)"
            },
            _active: {
                bg: "interactive.dark",
            },
            _disabled: {
                bg: "interactive.gray",
                color: "interactive.transparentWhite"
            }
        }
    },
    defaultProps: {}
}


export default Button;