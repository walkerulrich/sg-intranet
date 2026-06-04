def test_health():
    """Test basique pour valider que le pipeline fonctionne."""
    assert True


def test_login():
    """Test de la route login."""
    response = client.post("/api/auth/login")
    assert response.status_code == 200