from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import LoginSerializer, UserSerializer

class LoginView(APIView):
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        
        if serializer.is_valid():
            email = serializer.validated_data['email']
            password = serializer.validated_data['password']
            
            from django.contrib.auth import get_user_model
            User = get_user_model()
            
            # Authenticate the user manually from the APIView
            user = User.objects.filter(email=email).first()
            
            if user is not None and user.check_password(password):
                # Generate tokens for the user
                refresh = RefreshToken.for_user(user)
                
                # Serialize the user details
                user_serializer = UserSerializer(user)
                
                return Response({
                    'refresh': str(refresh),
                    'access': str(refresh.access_token),
                    'user': user_serializer.data
                }, status=status.HTTP_200_OK)
            else:
                return Response({"detail": "Invalid email or password"}, status=status.HTTP_401_UNAUTHORIZED)
                
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



class AdminLoginView(APIView):
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        
        if serializer.is_valid():
            email = serializer.validated_data['email']
            password = serializer.validated_data['password']
            
            from django.contrib.auth import get_user_model
            User = get_user_model()
            
            user = User.objects.filter(email=email).first()
            
            if user is not None and user.check_password(password):
                if hasattr(user, 'admin_profile'):
                    refresh = RefreshToken.for_user(user)
                    user_serializer = UserSerializer(user)
                    return Response({
                        'refresh': str(refresh),
                        'access': str(refresh.access_token),
                        'user': user_serializer.data
                    }, status=status.HTTP_200_OK)
                else:
                    return Response({"detail": "User does not have admin privileges."}, status=status.HTTP_403_FORBIDDEN)
            else:
                return Response({"detail": "Invalid email or password"}, status=status.HTTP_401_UNAUTHORIZED)
                
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
