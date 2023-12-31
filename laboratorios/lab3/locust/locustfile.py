from locust import HttpUser, task, between

class EchoTester(HttpUser):
    wait_time = between(1, 2)

    @task
    def get_echo(self):
        self.client.get("/")
