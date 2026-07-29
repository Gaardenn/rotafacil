const ERROR_MAP = {
    'Invalid login credentials': 'E-mail ou senha incorretos.',
    'User already registered': 'Esse e-mail já tem uma conta. Tente entrar.',
    'Password should be at least 6 characters': 'A senha precisa ter pelo menos 6 caracteres.',
    'Código de convite inválido': 'Esse código não existe. Confira com quem te convidou.',
    'Unable to validate email address: invalid format': 'Digite um e-mail válido.',
}

export function translateError(error) {
    if (!error) return ''
    return ERROR_MAP[error.message] ?? 'Algo deu errado. Tente novamente em instantes.'
}