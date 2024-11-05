using System;

class YAMS {

  public static void Affiche(int[] T, int N) {      //AFFICHE tab de N entiers
    for (int i=0; i<N; i++) {
      Console.Write(T[i]+" ");
    }
    Console.WriteLine();
  }

  public static bool Present(int[] T, int n) {
    bool pres=false;
    for (int i=0; i<5 && pres==false; i++) {
      if (T[i]==n) {pres=true;}
    }
    return pres;
  }

  public static int[] Trie(int[] T) {     // TRIE tab de 6 entiers
    int min;
    for (int i=0; i<5; i++) {
      min = i;
      for (int j=i; j<5; j++) {
        if (T[j]<T[min]) {
          min=j;
        }
      }
      int tmp = T[i];
      T[i] = T[min];
      T[min] = tmp;
    }
    return T;
  }

    // T DOIT ETRE UN TABLEAU TRIE POUR LES TESTS
  public static int NbDansTab(int[] T, int n) {     // COMPTE le nombre de n dans tab
    int compt = 0;
    for (int i=0; i<5; i++) {
      if (T[i]==n) {compt++;}
    }
    return compt;
  }

  public static int Brelan(int[] T) {     // TESTE un brelan et renvoie le score
    int score = 0;
    for (int i=1; i<7; i++) {
      if (NbDansTab(T,i)>=3) {
        score=i*3;
      }
    }
    return score;
  }
  public static int Carre(int[] T) {      // TESTE un carré et renvoie le score
    int score = 0;
    for (int i=1; i<7; i++) {
      if (NbDansTab(T,i)>=4) {
        score=i*4;
      }
    }
    return score;
  }
  public static int Full(int[] T) {     // TESTE un full et renvoie le score
    int score = 0;
    int n1=T[0];
    int n2=T[4];
    if ((NbDansTab(T,n1)==2 && NbDansTab(T,n2)==3) || (NbDansTab(T,n1)==3 && NbDansTab(T,n2)==2)) {
      score=25;
    }
    return score;
  }
  public static int PetiteSuite(int[] T) {      // TESTE une petite suite et renvoie le score
    int score = 0;
    bool suite=false;
    for (int j=1; j<4 && suite==false; j++) {
      suite = true;
      for (int i=j; i<j+4; i++) {
        if (Present(T,i)==false) {suite=false;}
      }
    }
    if (suite) {score=30;}
    return score;
  }
  public static int GrandeSuite(int[] T) {      // TESTE une grande suite et renvoie le score
    int score = 0;
    bool suite=false;
    for (int j=1; j<3 && suite==false; j++) {
      suite = true;
      for (int i=j; i<j+5; i++) {
        if (Present(T,i)==false) {suite=false;}
      }
    }
    if (suite) {score=40;}
    return score;
  }
  public static int Yams(int[] T) {      // TESTE un yams et renvoie le score
    int score = 0;
    int n=T[0];
    if (NbDansTab(T,n)==5) {score=50;}
    return score;
  }
  public static int Chance(int[] T) {     // TESTE une chance et renvoie le score
    int somme=0;
    for (int i=0; i<5; i++) {
      somme=somme+T[i];
    }
    return somme;
  }


  public static int[] LanceDes(int N) {      // Lance N dés et renvoie le tab
    Random random = new Random();
    int[] T = new int[5] {0,0,0,0,0};
    for (int i=0; i<N; i++) {
      T[i] = random.Next(1,7);
    }
    return T;
  }







  public static void Main() {
    int[] T = LanceDes(5);
    
    T = Trie(T);
    Affiche(T,5);
    Console.WriteLine("Brelan : "+Brelan(T));
    Console.WriteLine("Carré : "+Carre(T));
    Console.WriteLine("Full : "+Full(T));
    Console.WriteLine("Petite Suite : "+PetiteSuite(T));
    Console.WriteLine("Grande Suite : "+GrandeSuite(T));
    Console.WriteLine("Yam's : "+Yams(T));
    Console.WriteLine("Chance : "+Chance(T));
  }
}