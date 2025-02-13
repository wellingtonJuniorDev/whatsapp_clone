import Link from "@mui/material/Link";
import Container from "@mui/material/Container";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { useHttp } from "../../hooks/useHttp";
import { ILoginReponse, ILoginRequest } from "../../interfaces/ILogin";
import { useAuth } from "../../hooks/useAuth";

export function SignIn() {
  const navigate = useNavigate();
  const { signIn } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ILoginRequest>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const [sendRequest, loading, httpErrors] = useHttp<ILoginReponse>({
    url: "sign-in",
    method: "POST",
  });

  const onSubmit = async (data: ILoginRequest) => {
    const result = await sendRequest({ payload: data });
    signIn(result);
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Entrar
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          sx={{ mt: 1 }}
        >
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email"
            autoComplete="email"
            autoFocus
            {...register("email", {
              required: "Campo obrigatório",
              pattern: {
                value: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/,
                message: "Email inválido",
              },
            })}
            error={!!errors.email?.message}
            helperText={errors.email?.message}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            label="Password"
            type="password"
            id="password"
            {...register("password", {
              required: "Campo obrigatório",
              pattern: {
                value:
                  /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/,
                message:
                  "A senha de possuir mínimo de 8 caracteres, 1 letra maiúscula, número e caractere especial",
              },
            })}
            error={!!errors.password?.message}
            helperText={errors.password?.message}
            autoComplete="current-password"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={loading}
          >
            Entrar
          </Button>
          <Grid container>
            <Grid item>
              <Link onClick={() => navigate("sign-up")} variant="body2">
                {"Ainda não tem uma conta? Registrar"}
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>

      {httpErrors?.map((error) => (
        <Alert severity="error" key={error}>
          {error}
        </Alert>
      ))}
    </Container>
  );
}
