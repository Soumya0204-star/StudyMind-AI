import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import {
  Brain,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Activity,
  Award,
  Sparkles,
  Lock,
  Rocket,
} from "lucide-react";

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const { signIn, signUp, signInAsGuest } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (isLogin) {
      const { error } = await signIn(email, password);
      if (error) {
        toast({ title: "Login failed", description: error.message, variant: "destructive" });
      } else {
        navigate("/dashboard");
      }
    } else {
      if (!name.trim()) {
        toast({ title: "Name required", description: "Please enter your name", variant: "destructive" });
        setLoading(false);
        return;
      }
      const { error } = await signUp(email, password, name);
      if (error) {
        toast({ title: "Signup failed", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Account created!", description: "You can now log in." });
        setIsLogin(true);
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-background text-foreground">
      {/* Left Column: Business & Societal Impact Presentation */}
      <div className="lg:w-1/2 p-8 sm:p-12 lg:p-16 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-border/60 bg-muted/20">
        <div className="space-y-6 max-w-lg">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center text-primary-foreground shadow-sm">
              <Brain className="h-6 w-6" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-foreground">
                StudyMind <span className="text-primary">AI</span>
              </span>
              <span className="block text-[11px] text-muted-foreground font-medium -mt-0.5">
                Verified Study Engagement & Wellness Platform
              </span>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <Badge
              variant="outline"
              className="bg-primary/10 text-primary border-primary/20 text-xs font-medium py-0.5 px-2.5"
            >
              Enterprise & Higher Education Ready
            </Badge>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight text-foreground">
              Proven Learning Engagement with Digital Wellness.
            </h1>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Designed for online learners, academic institutions, and corporate training programs.
              StudyMind AI bridges the gap between self-paced learning and genuine accountability
              while protecting student physical wellbeing.
            </p>
          </div>

          {/* Key Value Propositions */}
          <div className="space-y-3 pt-2">
            <div className="flex items-start gap-3 p-3 rounded-xl border border-primary/40 bg-primary/10">
              <Rocket className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <div className="font-semibold text-sm flex items-center gap-1.5">
                  <span>Career Crash Simulator & Failure Map</span>
                  <Badge variant="outline" className="text-[9px] bg-primary/20 text-primary border-primary/30">NEW</Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  Test target careers before committing 6 months, diagnose failure vectors before placement season, and fix bottlenecks with cognitive drills.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-xl border bg-card/60">
              <Clock className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <div className="font-semibold text-sm">Tamper-Proof Verified Study Hours</div>
                <p className="text-xs text-muted-foreground">
                  Browser-side vision verifies actual seated study time and auto-pauses when students
                  step away, generating certified proof of study completion.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-xl border bg-card/60">
              <Activity className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <div className="font-semibold text-sm">Ergonomic Health & 20-20-20 Eye Protection</div>
                <p className="text-xs text-muted-foreground">
                  Monitors posture slouching, tracks screen gaze, and cues eye-rest intervals to prevent
                  physical fatigue and digital eye strain.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-xl border bg-card/60">
              <Award className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <div className="font-semibold text-sm">Official Verification Certificates</div>
                <p className="text-xs text-muted-foreground">
                  Export verified study attendance dossiers for universities, employers, and corporate
                  upskilling credentials.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-8 text-xs text-muted-foreground flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-emerald-500" />
          <span>100% Private • Local Browser Vision Processing • Zero Video Uploads</span>
        </div>
      </div>

      {/* Right Column: Authentication Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12">
        <Card className="w-full max-w-md border shadow-lg">
          <CardHeader className="space-y-1.5 text-center pb-4">
            <CardTitle className="text-2xl font-bold">
              {isLogin ? "Sign In to Your Workspace" : "Create Student Account"}
            </CardTitle>
            <CardDescription className="text-xs">
              {isLogin
                ? "Enter your credentials to access your verified study dashboard"
                : "Join your institution's verified learning portal"}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-3.5">
              {!isLogin && (
                <div className="space-y-1.5">
                  <Label htmlFor="name" className="text-xs">Full Name</Label>
                  <Input
                    id="name"
                    placeholder="Jane Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required={!isLogin}
                    className="h-10 text-sm"
                  />
                </div>
              )}

              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-xs">Institutional or Personal Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="student@university.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-10 text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="password" className="text-xs">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="h-10 text-sm"
                />
              </div>

              <Button
                type="submit"
                className="w-full h-10 text-sm font-semibold mt-2"
                disabled={loading}
              >
                {loading ? "Authenticating..." : isLogin ? "Sign In" : "Create Account"}
              </Button>

              <div className="relative my-3">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-border/60" />
                </div>
                <div className="relative flex justify-center text-[10px] uppercase">
                  <span className="bg-card px-2 text-muted-foreground font-mono">
                    Evaluation & Quick Preview
                  </span>
                </div>
              </div>

              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  signInAsGuest();
                  navigate("/dashboard");
                }}
                className="w-full h-10 text-xs font-semibold border-primary/40 bg-primary/5 hover:bg-primary/10 text-primary gap-2"
              >
                <Sparkles className="h-3.5 w-3.5" />
                <span>Instant Demo / Judge Preview Mode</span>
              </Button>
            </form>

            <div className="text-center text-xs pt-2">
              <span className="text-muted-foreground">
                {isLogin ? "Need a study account?" : "Already enrolled?"}
              </span>{" "}
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-primary font-semibold hover:underline"
              >
                {isLogin ? "Sign up here" : "Sign in"}
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
