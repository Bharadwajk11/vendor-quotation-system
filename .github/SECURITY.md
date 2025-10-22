# Security Policy

## Supported Versions

We release security updates for the following versions:

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |

## Reporting a Vulnerability

We take security vulnerabilities seriously. If you discover a security issue, please follow these steps:

### 1. **Do Not** Open a Public Issue

Please do not report security vulnerabilities through public GitHub issues.

### 2. Report Privately

Instead, please report security vulnerabilities by emailing:
- **Email:** [security@yourdomain.com]
- **Subject:** [SECURITY] Brief description of the issue

### 3. What to Include

Please include the following information:
- Type of vulnerability
- Full paths of source file(s) related to the vulnerability
- Location of the affected code (tag/branch/commit)
- Step-by-step instructions to reproduce the issue
- Proof-of-concept or exploit code (if possible)
- Impact of the vulnerability
- Suggested fix (if you have one)

### 4. Response Timeline

- **Initial Response:** Within 48 hours
- **Status Update:** Within 7 days
- **Fix & Disclosure:** Within 30-90 days (depending on severity)

## Security Best Practices

### For Users

1. **Environment Variables**
   - Never commit `.env` files
   - Use strong `SECRET_KEY` values
   - Rotate secrets regularly

2. **Database**
   - Use strong database passwords
   - Restrict database access to localhost when possible
   - Enable database backups

3. **Production Deployment**
   - Set `DEBUG=False` in production
   - Use HTTPS only
   - Configure proper `ALLOWED_HOSTS`
   - Keep dependencies updated

4. **User Accounts**
   - Use strong passwords
   - Enable two-factor authentication when available
   - Review user permissions regularly

### For Developers

1. **Code Security**
   - Validate all user inputs
   - Use parameterized queries (Django ORM handles this)
   - Implement proper authentication and authorization
   - Sanitize data before rendering

2. **Dependencies**
   - Run `pip list --outdated` regularly
   - Run `npm audit` regularly
   - Update dependencies promptly
   - Review dependency security advisories

3. **Testing**
   - Write security tests
   - Test authentication flows
   - Test authorization boundaries
   - Test input validation

## Known Security Considerations

### Authentication
- This application uses Django's built-in authentication
- Passwords are hashed using PBKDF2 algorithm with SHA256
- Session cookies are HTTP-only

### CORS
- CORS is configured for frontend-backend communication
- Production deployments should restrict `CORS_ALLOWED_ORIGINS`

### Database
- Single-tenant architecture ensures data isolation
- All queries filter by company ID automatically
- SQL injection protection via Django ORM

### File Uploads
- Currently no file upload functionality
- If implementing, validate file types and sizes
- Store uploads outside web root

## Security Updates

We will publish security advisories through:
- GitHub Security Advisories
- Release notes
- Email notifications (if you've starred the repo)

## Recognition

We appreciate security researchers who responsibly disclose vulnerabilities. With your permission, we will:
- Acknowledge you in release notes
- Add you to our security hall of fame
- Provide a reference for your portfolio

Thank you for helping keep our users safe!
