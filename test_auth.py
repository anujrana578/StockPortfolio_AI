import unittest
import json
import sqlite3
from app import app, get_db_connection

class TestAuthSystem(unittest.TestCase):
    def setUp(self):
        self.client = app.test_client()
        self.app_context = app.app_context()
        self.app_context.push()

    def tearDown(self):
        self.app_context.pop()

    def test_health_endpoint(self):
        res = self.client.get('/api/health')
        self.assertEqual(res.status_code, 200)
        data = json.loads(res.data)
        self.assertEqual(data['status'], 'healthy')

    def test_local_login_seeded_user(self):
        res = self.client.post('/api/auth/login', json={
            'username': 'arpit',
            'password': 'arpit@980'
        })
        self.assertEqual(res.status_code, 200)
        data = json.loads(res.data)
        self.assertTrue(data['authenticated'])
        self.assertIn('token', data)
        self.assertEqual(data['user']['username'], 'arpit')

    def test_local_login_invalid_password(self):
        res = self.client.post('/api/auth/login', json={
            'username': 'arpit',
            'password': 'wrongpassword'
        })
        self.assertEqual(res.status_code, 401)
        data = json.loads(res.data)
        self.assertFalse(data['authenticated'])

    def test_local_registration_valid_and_duplicate_handling(self):
        test_user = "testquant_alpha"
        test_email = "quant.alpha@finsight.io"

        # Cleanup if exists
        conn = get_db_connection()
        conn.execute("DELETE FROM users WHERE username = ? OR email = ?", (test_user, test_email))
        conn.commit()
        conn.close()

        # 1. Register new user
        res = self.client.post('/api/auth/register', json={
            'username': test_user,
            'email': test_email,
            'password': 'StrongPassword@123',
            'confirm_password': 'StrongPassword@123'
        })
        self.assertEqual(res.status_code, 201)
        data = json.loads(res.data)
        self.assertTrue(data['success'])
        self.assertIn('token', data)

        # 2. Duplicate username check
        res_dup_user = self.client.post('/api/auth/register', json={
            'username': test_user,
            'email': 'another.email@finsight.io',
            'password': 'StrongPassword@123',
            'confirm_password': 'StrongPassword@123'
        })
        self.assertEqual(res_dup_user.status_code, 409)

        # 3. Duplicate email check
        res_dup_email = self.client.post('/api/auth/register', json={
            'username': 'different_user',
            'email': test_email,
            'password': 'StrongPassword@123',
            'confirm_password': 'StrongPassword@123'
        })
        self.assertEqual(res_dup_email.status_code, 409)

        # 4. Weak password check
        res_weak = self.client.post('/api/auth/register', json={
            'username': 'random_valid_user',
            'email': 'random.valid@finsight.io',
            'password': '123',
            'confirm_password': '123'
        })
        self.assertEqual(res_weak.status_code, 400)

    def test_google_auth_first_time_and_existing_user(self):
        google_email = "new.google.investor@gmail.com"
        google_id = "google_sub_id_999888777"

        # Cleanup
        conn = get_db_connection()
        conn.execute("DELETE FROM users WHERE email = ? OR google_id = ?", (google_email, google_id))
        conn.commit()
        conn.close()

        # 1. First time Google Auth
        res = self.client.post('/api/auth/google', json={
            'email': google_email,
            'name': 'Google Investor',
            'google_id': google_id,
            'picture': 'https://example.com/avatar.jpg'
        })
        self.assertEqual(res.status_code, 201)
        data = json.loads(res.data)
        self.assertTrue(data['authenticated'])
        self.assertIn('token', data)
        self.assertEqual(data['user']['email'], google_email)

        # 2. Existing Google User Auth
        res_existing = self.client.post('/api/auth/google', json={
            'email': google_email,
            'name': 'Google Investor',
            'google_id': google_id
        })
        self.assertEqual(res_existing.status_code, 200)
        data_existing = json.loads(res_existing.data)
        self.assertTrue(data_existing['authenticated'])

    def test_auth_me_endpoint_security(self):
        # 1. Login to get token
        res = self.client.post('/api/auth/login', json={
            'username': 'arpit',
            'password': 'arpit@980'
        })
        token = json.loads(res.data)['token']

        # 2. Access /api/auth/me with Bearer token
        res_me = self.client.get('/api/auth/me', headers={'Authorization': f'Bearer {token}'})
        self.assertEqual(res_me.status_code, 200)
        data_me = json.loads(res_me.data)
        self.assertTrue(data_me['authenticated'])
        self.assertNotIn('password_hash', data_me['user'])
        self.assertNotIn('password', data_me['user'])

if __name__ == '__main__':
    unittest.main()
